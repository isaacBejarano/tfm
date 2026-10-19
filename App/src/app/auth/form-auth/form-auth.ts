import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FieldTree,
  form,
  FormField,
  maxLength,
  minLength,
  pattern,
  required,
} from '@angular/forms/signals';
import { BehaviorSubject, distinctUntilChanged, filter, tap } from 'rxjs';

import { User, UserPayload, UserPayloadOptionals } from '@app/auth/models/dto-user.type';
import { FormType } from '@app/auth/types/form.type';
import { Btn } from '@shared/components/btn/btn';

@Component({
  selector: 'app-form-auth',
  templateUrl: './form-auth.html',
  imports: [Btn, FormField],
  styles: `
    :host {
      display: block;
    }
  `,
})
export class FormAuth implements OnInit {
  // DI
  private readonly _destroyRef = inject(DestroyRef);

  // I/O
  readonly excludeFields = input<(keyof UserPayloadOptionals)[]>();

  // MODEL + FORM

  protected readonly user = signal<User>({
    id: '',
    email: '',
    password: '',
    name: '',
  });

  protected readonly form = form(this.user, (field) => {
    // email
    required(field.email, { message: "El campo 'Correo electrónico' es obligatorio." });
    minLength(field.email, 6, {
      message: "El campo 'Correo electrónico' debe tener al menos 6 carácteres.",
    });
    maxLength(field.email, 64); // Adds MAX_LENGTH property to HTML input & maxLength of AN email's local-part is 64 octets UTF8 -> 64 ch
    pattern(field.email, /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, {
      message: "El campo 'Correo electrónico' debe tener un patrón válido.",
    });
    // password
    required(field.password, { message: "El campo 'Contraseña' es obligatorio." });
    minLength(field.password, 8, {
      message: "El campo 'Contraseña' debe tener al menos 8 carácteres.",
    });
    maxLength(field.password, 16); // Adds MAX_LENGTH property to HTML
    pattern(
      field.password,
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$/,
      {
        message:
          "El campo 'Contraseña' debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial.",
      },
    );
    // name
    maxLength(field.name, 25); // Adds MAX_LENGTH property to HTML
  });

  // CTRL
  ////

  readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', ['raise']);
  readonly btnGray: string = Btn.style('gray', 'outline', 'normal', ['raise']);
  protected readonly formAuth = input<FormType>();
  protected readonly $formAuth = output<UserPayload>();
  private readonly _debounceForm$$ = new BehaviorSubject<UserPayload | null>(null); // UX -> block rapid multiple submit

  // FIXME : debaunceForm not working
  ngOnInit(): void {
    this._debounceForm$$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((credentials) => credentials !== null),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap((credentials) => this.$formAuth.emit(credentials)),
        tap(() => this._debounceForm$$.next(null)),
      )
      .subscribe();
  }

  protected setFieldStyle(field: FieldTree<string | number, string>): string {
    if (field().dirty() && field().errors().length > 0) return `border ${Btn.borderColors['red']}`;
    else if (field().dirty() && field().errors().length === 0)
      return `border ${Btn.borderColors['green']}`;
    else return `border ${Btn.borderColors['gray']}`;
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
      this.form.email().markAsDirty();
      this.form.password().markAsDirty();
      this.form.name().markAsDirty();
      return;
    }

    const form: User = this.form().value();
    const payload: UserPayload = {
      id: form.id,
      email: form.email,
      password: form.password,
      name: this.form.name().value().trim() === '' ? null : form.name,
    };

    this._debounceForm$$.next(payload);
  }
}
