<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class ProviderController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        // $googleUser = Socialite::driver('google')->user();

        // $user = User::updateOrCreate([
        //     'email' => $googleUser->email,
        // ], [
        //     'name' => $googleUser->name,
        //     'google_id' => $googleUser->id,
        //     'avatar' => $googleUser->avatar,
        //     // 'password' => Hash::make(Str::random(24)), // Password aleatorio por seguridad
        //     // Solo asignamos password si es un usuario nuevo
        //     'password' => $user->password ?? Hash::make(Str::random(24)),
        // ]);

        // Auth::login($user);

        // return redirect(config('fortify.home'));



        $googleUser = Socialite::driver('google')->user();

        // 1. Buscamos al usuario por email o lo creamos si no existe
        // Usamos una función anónima para setear los datos por defecto si es NUEVO
        $user = User::firstOrCreate(
            ['email' => $googleUser->email],
            [
                'name' => $googleUser->name,
                'google_id' => $googleUser->id,
                'avatar' => $googleUser->avatar, // Al ser nuevo, sí usa la foto de Google
                'password' => Hash::make(Str::random(24)),
            ]
        );

        // 2. Si el usuario YA EXISTÍA, actualizamos sus datos básicos de forma segura
        if (!$user->wasRecentlyCreated) {
            $user->name = $googleUser->name;
            $user->google_id = $googleUser->id;

            // 🌟 REGLA DE ORO: Solo pisamos el avatar si está vacío o si tiene la URL vieja de Google
            if (empty($user->avatar) || str_contains($user->avatar, 'googleusercontent.com')) {
                $user->avatar = $googleUser->avatar;
            }

            $user->save();
        }

        // 3. Logueamos y redireccionamos de forma limpia
        Auth::login($user);

        return redirect(config('fortify.home'));
    }
}
