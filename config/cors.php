<?php

return [
    /*
     * Allow all origins.
     *
     * You can also set specific allowed origins using an array:
     * 'allowed_origins' => ['http://localhost:3000', 'https://example.com'],
     */
    'allowed_origins' => ['*'],

    /*
     * Allow all methods.
     *
     * You can also set specific allowed methods using an array:
     * 'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
     */
    'allowed_methods' => ['*'],

    /*
     * Allow all headers.
     *
     * You can also set specific allowed headers using an array:
     * 'allowed_headers' => ['Content-Type', 'Authorization'],
     */
    'allowed_headers' => ['*'],

    /*
     * The maximum age (in seconds) of the CORS preflight request cache.
     */
    'max_age' => 3600,
];