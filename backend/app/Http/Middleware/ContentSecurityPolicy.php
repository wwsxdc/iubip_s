<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ContentSecurityPolicy
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Добавление заголовка CSP для защиты от инлайн-скриптов и других угроз
        $response = $next($request);

        // Пример CSP: Разрешаем только безопасные источники
        $cspHeader = "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none'; style-src 'self' 'unsafe-inline';";

        // Добавляем заголовок к ответу
        $response->headers->set('Content-Security-Policy', $cspHeader);

        return $response;
    }
}
