<?php

namespace Core;
class DB {
    private $dbConnection = null;
    public function __construct($host, $port, $db, $user,$pass)
    {
        try {
            $this->dbConnection = new \PDO(
                "mysql:host=$host;port=$port;charset=utf8mb4;dbname=$db",
                // "sqlsrv:Server=41.63.9.35,1433;Database=$db", 
                $user,
                $pass
            );
        } catch (\PDOException $e) {
            exit($e->getMessage());
        }

    }
    public function getConnection()
    {
        return $this->dbConnection;
    }
}