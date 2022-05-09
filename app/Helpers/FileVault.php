<?php

namespace App\Helpers;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\Mime\MimeTypes;

class FileVault
{
    /**
     * Decrypt content
     *
     * @param string $path
     * @return mixed
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public static function decrypt(string $path)
    {
        return decrypt(Storage::get($path));
    }

    /**
     * Encrypt content
     *
     * @param string $content
     * @param string $dir
     * @return string
     */
    public static function encrypt(string $content, string $dir = 'vault')
    {
        Storage::put($path = static::hashName($dir), encrypt($content));
        return $path;
    }

    /**
     * Get a filename for the file.
     *
     * @param string $directory
     * @param string $extension
     * @return string
     */
    public static function hashName(string $directory)
    {
        return rtrim($directory, '/') . '/' . Str::random(40) . ".enc";
    }
}