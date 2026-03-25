import { Form, Head } from '@inertiajs/react';
// import { route } from 'ziggy-js';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { __ } from '@/translate'; // Ajusta la ruta según donde lo guardes

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export function LoginWithGoogle() {
    return (
        <>
            <a
                href={route('google.redirect')}
                className="mt-4 flex w-full justify-center rounded-md bg-pasteleria-rosa px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Continuar con Google
            </a>
        </>
    )
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title={__('Log in to your account')}
            description={__('Enter your email and password below to log in')}
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">{__('Email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@ejemplo.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">{__('Password')}</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            {__('Forgot your password?')}
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder={__('Password')}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">{__('Remember me')}</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}

                                {__('Log in')}
                            </Button>
                        </div>
                        <LoginWithGoogle />
                        {canRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                {__("Don't have an account")}?{' '}
                                <TextLink href={register()} tabIndex={5} >
                                    {__('Register')}
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {
                status && (
                    <div className="mb-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )
            }
        </AuthLayout >
    );
}
