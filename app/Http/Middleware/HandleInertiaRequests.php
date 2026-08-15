<?php

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use App\Models\PageSection;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            // 'auth' => [
            //     'user' => $request->user(),
            // ],
            'auth' => [
                'user' => $request->user(),
                'role' => $request->user() ? $request->user()->getRoleNames()->first() : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            // Añadimos las traducciones aquí
            'translations' => function () {
                if (! file_exists(lang_path('es.json'))) {
                    return [];
                }

                return json_decode(file_get_contents(lang_path('es.json')), true);
            },
            // 🌟 NUEVO: Datos globales del CMS accesibles desde cualquier layout o página pública
            'site_settings' => function () {
                return SiteSetting::pluck('value', 'key')->all();
            },
            'sections' => function () {
                return PageSection::select('id', 'slug', 'title')->get()->map(function ($section) {
                    return [
                        'id' => $section->id,
                        'slug' => $section->slug,
                        'title' => $section->title,
                    ];
                });
            },

            // ASEGURATE DE TENER ESTO EN TU PROYECTO:
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
