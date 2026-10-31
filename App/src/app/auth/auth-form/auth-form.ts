import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { BehaviorSubject, distinctUntilChanged, filter, tap } from 'rxjs';

import { User, UserPayloadLogin, UserPayloadSignup, UserRole } from '@app/user/user-model.type';
import { Btn } from '@shared/components/btn/btn';
import { REGEX_EMAIL, REGEX_PASSWORD } from '@shared/constants/regex';
import { validationBorder } from '@shared/utils/form-field.util';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.html',
  imports: [Btn, FormField],
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AuthForm implements OnInit {
  // I/O
  readonly excludeFields = input<(keyof (UserPayloadLogin & UserPayloadSignup))[]>();

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
    // email
    required(field.email, { message: "El campo 'Correo electrónico' es obligatorio." });
    minLength(field.email, 6, {
      message: "El campo 'Correo electrónico' debe tener al menos 6 carácteres.",
    });
    maxLength(field.email, 64); // Adds MAX_LENGTH property to HTML input (email's local-part is 64 octets UTF8 max)
    pattern(field.email, REGEX_EMAIL, {
      message: "El campo 'Correo electrónico' debe tener un patrón válido.",
    });
    // password
    required(field.password, { message: "El campo 'Contraseña' es obligatorio." });
    minLength(field.password, 8, {
      message: "El campo 'Contraseña' debe tener al menos 8 carácteres.",
    });
    maxLength(field.password, 16); // Adds MAX_LENGTH property to HTML input
    pattern(field.password, REGEX_PASSWORD, {
      message:
        "El campo 'Contraseña' debe incluir al menos una mayúscula, una minúscula, un número y uno de los siguientes carácteres especiales: `~!@#$%^&*()_+-={}|[]:\"\";'<>?,./",
    });
    // name
    maxLength(field.name, 25); // Adds MAX_LENGTH property to HTML input
  });

  // CTRL
  ////

  readonly validationBorder = validationBorder;

  readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', ['raise', '3d-gray']);
  readonly btnGray: string = Btn.style('gray', 'outline', 'normal', ['raise', '3d-gray']);

  // FIXME: remove debug auto
  readonly btnRedSlim: string = Btn.style('red', 'outline', 'slim', ['raise', '3d-red']);

  protected readonly $userPayload = output<UserPayloadLogin | UserPayloadSignup>();
  private readonly _debounceForm$$ = new BehaviorSubject<
    UserPayloadLogin | UserPayloadSignup | null
  >(null); // UX -> block rapid multiple submit

  ngOnInit(): void {
    this._debounceForm$$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((credentials) => credentials !== null),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap((credentials) => this.$userPayload.emit(credentials)),
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
      this.form.email().markAsDirty();
      this.form.password().markAsDirty();
      this.form.name().markAsDirty();
      return;
    }

    const form: User = this.form().value();

    let payload: UserPayloadLogin | UserPayloadSignup;

    if ((this.excludeFields() ?? []).includes('name')) {
      payload = {
        email: form.email,
        password: form.password,
      } as UserPayloadLogin;
    } else {
      payload = {
        email: form.email,
        password: form.password,
        name: form.name.trim() === '' ? null : form.name,
      } as UserPayloadSignup;
    }

    this._debounceForm$$.next(payload);
  }

  // FIXME: DEBUG
  autoLogin(role: UserRole): void {
    const payloadLogin: UserPayloadLogin =
      role === 'User'
        ? {
            email: 'Dorofeeva@yopmail.com',
            password: 'Bb@12345',
          }
        : role === 'Admin'
          ? {
              email: 'Tribunal@yopmail.com',
              password: 'Tribunal@uoc2026',
            }
          : {
              email: 'Super@yopmail.com',
              password: 'Super@uoc2026',
            };

    this._debounceForm$$.next(payloadLogin);
  }
}
