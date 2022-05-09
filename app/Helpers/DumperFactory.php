<?php

namespace App\Helpers;

use Illuminate\Database\ConfigurationUrlParser;
use Illuminate\Support\Arr;
use LogicException;
use Spatie\DbDumper\Databases\MongoDb;
use Spatie\DbDumper\Databases\MySql;
use Spatie\DbDumper\Databases\PostgreSql;
use Spatie\DbDumper\Databases\Sqlite;
use Spatie\DbDumper\DbDumper;

class DumperFactory
{
    public static function createFromConnection(string $connectionName): DbDumper
    {
        $parser = new ConfigurationUrlParser();

        $config = $parser->parseConfiguration(config("database.connections.{$connectionName}"));

        if (isset($config['read'])) {
            $config = Arr::except(
                array_merge($config, $config['read']),
                ['read', 'write']
            );
        }

        $dumper = static::forDriver($config['driver'] ?? '')
            ->setHost(Arr::first(Arr::wrap($config['host'] ?? '')))
            ->setDbName($config['database'])
            ->setUserName($config['username'] ?? '')
            ->setPassword($config['password'] ?? '');

        if ($dumper instanceof MySql) {
            $dumper->setDefaultCharacterSet($config['charset'] ?? '');
        }

        if ($dumper instanceof MongoDb) {
            $dumper->setAuthenticationDatabase($config['dump']['mongodb_user_auth'] ?? '');
        }

        if (isset($config['port'])) {
            $dumper = $dumper->setPort($config['port']);
        }

        if (isset($config['unix_socket'])) {
            $dumper = $dumper->setSocket($config['unix_socket']);
        }

        return $dumper;
    }

    protected static function forDriver($name): DbDumper
    {
        $driver = strtolower($name);

        if ($driver === 'mysql' || $driver === 'mariadb') {
            return new MySql();
        }

        if ($driver === 'pgsql') {
            return new PostgreSql();
        }

        if ($driver === 'sqlite') {
            return new Sqlite();
        }

        if ($driver === 'mongodb') {
            return new MongoDb();
        }

        throw new LogicException("Unknown database driver");
    }
}