<?php


namespace App\Models\Traits;


use BadFunctionCallException;
use Illuminate\Support\Facades\Cache;
use ReflectionFunction;

trait Lock
{
    /**
     * Get cache lock name
     *
     * @return string
     */
    protected function getLockName(): string
    {
        return 'lock.' . $this->getTable() . '.' . $this->getKey();
    }

    /**
     * Attempts to acquire lock
     *
     * @param callable|null $callback
     * @return mixed
     */
    public function acquireLock(callable $callback = null)
    {
        $ref = new ReflectionFunction($callback);

        return Cache::store('redis')->lock($this->getLockName())
            ->get(function () use ($ref) {
                switch ($ref->getNumberOfParameters()) {
                    case 1:
                        return $ref->invoke($this->fresh());
                    case 0:
                        return $ref->invoke();
                    default:
                        throw new BadFunctionCallException();
                }
            });
    }
}
