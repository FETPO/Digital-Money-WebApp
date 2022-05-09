<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\RegisterErrorViewPaths;
use Illuminate\Support\ViewErrorBag;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TransferException extends Exception
{
    /**
     * HTTP status code
     *
     * @var int
     */
    protected $statusCode = 403;

    /**
     * Render the exception into an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function render($request)
    {
        return $request->expectsJson() ?
            $this->prepareJsonResponse() :
            $this->prepareResponse();
    }

    /**
     * Prepare Json Response
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function prepareJsonResponse()
    {
        return response()->json([
            'message' => $this->getMessage()
        ], $this->statusCode);
    }

    /**
     * Prepare Response
     *
     * @return \Illuminate\Http\Response
     */
    protected function prepareResponse()
    {
        (new RegisterErrorViewPaths)();

        $exception = new HttpException(500, $this->getMessage());

        return response()->view('errors::403', [
            'exception' => $exception,
            'errors'    => new ViewErrorBag,
        ], $this->statusCode);
    }
}
