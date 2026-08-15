<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // // Limpiar caché de permisos
        // app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // // 1. Crear Permisos (opcional, pero mejor tenerlos)
        // Permission::create(['name' => 'manage products']);
        // Permission::create(['name' => 'manage orders']);

        // // 2. Crear Roles y asignar permisos
        // $adminRole = Role::create(['name' => 'admin']);
        // $adminRole->givePermissionTo(Permission::all());

        // $customerRole = Role::create(['name' => 'customer']);

        // // 3. Asignar rol a tu usuario (ajustá con tu email real)
        // $user = User::where('email', 'ivan.soliz@gmail.com')->first();
        // if ($user) {
        //     $user->assignRole($adminRole);
        // }

        $user = User::firstOrCreate(
            ['email' => 'admin.dulcesmomentos@gmail.com'],
            [
                'name' => 'Eliana Diaz',
                'password' => bcrypt('123456'),
            ]
        );

        // 1. Limpiar la caché de roles y permisos (Vital con Spatie)
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. Crear permisos específicos para Dulces Momentos
        $permissions = [
            'ver dashboard',
            'gestionar productos',
            'gestionar categorias',
            'gestionar pedidos',
            'gestionar estados',
            'gestionar usuarios',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // 3. Crear el Rol de Administrador y asignarle TODOS los permisos
        $roleAdmin = Role::create(['name' => 'admin']);
        $roleAdmin->givePermissionTo(Permission::all());

        // 4. Crear el Rol de Cliente (sin permisos especiales por ahora)
        $roleCustomer = Role::create(['name' => 'customer']);
        $roleCustomer->givePermissionTo(Permission::all());

        // 5. Asignar el rol de Admin a tu usuario actual
        // Reemplazá con tu correo real para que puedas entrar al panel
        $user = User::where('email', 'admin.dulcesmomentos@gmail.com')->first();

        if ($user) {
            $user->assignRole($roleAdmin);
        }
    }
}
