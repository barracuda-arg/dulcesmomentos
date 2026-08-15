<?php

if (! function_exists('get_image_path')) {
    /**
     * Obtiene la URL de la imagen.
     * Si el nombre contiene "demo", busca en public/.
     * Si no, busca en public/storage/.
     *
     * @param  string|null  $filename
     * @return string
     */
    function get_image_path($filename)
    {
        // 1. Si el nombre está vacío, devolvemos una imagen por defecto
        if (empty($filename)) {
            return asset('images/default-placeholder.png');
        }

        // 2. Verificamos si contiene la palabra "demo" (ignorando mayúsculas/minúsculas)
        if (str_contains(strtolower($filename), 'demo')) {
            // Retorna la ruta directa desde la carpeta public
            // Ejemplo: http://tu-app.test/demo-avatar.jpg
            return asset($filename);
        }

        // 3. Flujo normal de usuario: anteponemos "storage"
        // Ejemplo: http://tu-app.test/storage/user_photo.jpg
        return asset('storage/'.$filename);
    }
}
