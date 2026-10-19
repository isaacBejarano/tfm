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

@Component({
  selector: 'app-form-auth',
  templateUrl: './form-auth.html',
  imports: [FormField],
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
    maxLength(field.email, 150, {
      message: "El campo 'Correo electrónico' debe tener máximo 150 carácteres.",
    });
    pattern(field.email, /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, {
      message: "El campo 'Correo electrónico' debe tener un patrón válido.",
    });
    // password
    required(field.password, { message: "El campo 'Contraseña' es obligatorio." });
    minLength(field.password, 8, {
      message: "El campo 'Contraseña' debe tener al menos 8 carácteres.",
    });
    maxLength(field.password, 16, {
      message: "El campo 'Contraseña' debe tener máximo 16 carácteres.",
    });
    pattern(
      field.password,
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$/,
      {
        message:
          "El campo 'Contraseña' debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial.",
      },
    );
    // name
    minLength(field.name, 1, {
      message: "El campo 'Nombre' debe tener al menos 1 carácter.",
    });
    maxLength(field.name, 25, {
      message: "El campo 'Nombre' debe tener máximo 25 carácteres.",
    });
  });

  // CTRL
  ////

  protected readonly formAuth = input<FormType>();
  protected readonly $formAuth = output<UserPayload>();
  private readonly _debounceForm$$ = new BehaviorSubject<UserPayload | null>(null); // UX -> block rapid multiple submit

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

  // FIXME: delete base
  protected setBtnStyleBase() {
    if (!this.form().dirty()) return 'gray';
    return this.form().valid() ? 'green' : 'red';
  }

  protected setFieldStyle(field: FieldTree<string | number, string>): string {
    if (field().dirty() && field().errors().length > 0) return 'border border-red-700';
    else if (field().dirty() && field().errors().length === 0) return 'border border-green-600';
    else return 'border border-gray-500';
  }

  protected togglePasswordType(password: HTMLInputElement): void {
    password.setAttribute('type', password.type === 'password' ? 'text' : 'password'); // mutate by ref
  }

  // FIXME:
  protected togglePasswordIcon(password: HTMLInputElement): string {
    return password.type === 'password'
      ? './svg/icon-sprite.xml#icon-eye'
      : './svg/icon-sprite.xml#icon-eye-off';
  }

  protected onSubmit(): void {
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
