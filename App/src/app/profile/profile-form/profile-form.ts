import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, maxLength, minLength, pattern } from '@angular/forms/signals';
import { BehaviorSubject, distinctUntilChanged, filter, tap } from 'rxjs';

import { User, UserPayloadEdit } from '@app/user/user-model.type';
import { Btn } from '@shared/components/btn/btn';
import { REGEX_PASSWORD } from '@shared/constants/regex';
import { validationBorder } from '@shared/utils/form-field.util';

// FIXME: cleanup

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.html',
  imports: [Btn, FormField],
  styles: `
    :host {
      display: block;
    }
  `,
})
export class ProfileForm implements OnInit {
  // DI
  private readonly _destroyRef = inject(DestroyRef);

  // MODEL
  private readonly _defaultUser = signal<User>({
    id: '',
    agendaIds: [],
    email: '',
    password: '',
    name: '',
    roles: [],
  });

  // FORM
  protected readonly form = form(this._defaultUser, (field) => {
    // name
    maxLength(field.name, 25); // Adds MAX_LENGTH property to HTML
    // password
    minLength(field.password, 8, {
      message: "El campo 'Contraseña' debe tener al menos 8 carácteres.",
    });
    maxLength(field.password, 16); // Adds MAX_LENGTH property to HTML
    pattern(field.password, REGEX_PASSWORD, {
      message:
        "El campo 'Contraseña' debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial.",
    });
  });

  // CTRL
  ////

  readonly validationBorder = validationBorder;

  readonly btnRoseSlim: string = Btn.style('rose', 'outline', 'slim', ['raise', '3d-rose']);
  readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', ['raise', '3d-gray']);
  readonly btnGray: string = Btn.style('gray', 'outline', 'normal', ['raise', '3d-gray']);

  protected readonly $userPayload = output<UserPayloadEdit>();
  private readonly _debounceForm$$ = new BehaviorSubject<UserPayloadEdit | null>(null); // UX -> block rapid multiple submit

  ngOnInit(): void {
    this._debounceForm$$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((details) => details !== null),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap((details) => this.$userPayload.emit(details)),
        tap(() => this._debounceForm$$.next(null)),
      )
      .subscribe();
  }

  protected togglePasswordType(password: HTMLInputElement): void {
    password.setAttribute('type', password.type === 'password' ? 'text' : 'password'); // mutate by ref
  }

  protected togglePasswordIcon(password: HTMLInputElement): string {
    return password.type === 'password'
      ? 'svg/icon-sprite.xml#icon-eye'
      : 'svg/icon-sprite.xml#icon-eye-off';
  }

  protected onSubmit(e: Event): void {
    e.preventDefault();

    if (this.form().invalid()) {
      this.form.name().markAsDirty();
      this.form.password().markAsDirty();
      return;
    }

    const form: User = this.form().value();

    this._debounceForm$$.next({
      name: form.name,
      password: form.password,
    });
  }
}
