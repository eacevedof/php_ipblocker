<?php
declare(strict_types=1);
namespace Tests\Unit;

use Ipblocker\Components\ConfigComponent as cfg;
use Ipblocker\Components\Db\MysqlComponent;
use PHPUnit\Framework\TestCase;
use Ipblocker\Traits\LogTrait as Log;

use Ipblocker\Helpers\RequestHelper;
use Ipblocker\Component\ComponentIpblocker;

abstract class BaseTest extends TestCase
{
    use Log;

    public function setUp(): void
    {
        $_POST = [];
        $_FILES = [];
        $_GET = [];
        $_SERVER = [];
    }

    protected function _log_globals()
    {
        $this->logd($_POST,"POST");
        $this->logd($_GET,"GET");
        $this->logd($_FILES,"FILES");
        $this->logd($_SERVER,"SERVER");
    }

    protected function _add_post($k,$v)
    {
        if(is_string($k)) $_POST[$k] = $v;
        return $this;
    }

    protected function _add_get($k,$v)
    {
        if(is_string($k)) $_GET[$k] = $v;
        return $this;
    }

    protected function _add_files($k,$v)
    {
        if(is_string($k)) $_FILES[$k] = $v;
        return $this;
    }

    protected function _reset_post()
    {
        $_POST = [];
        return $this;
    }

    protected function _reset_get()
    {
        $_GET = [];
        return $this;
    }

    protected function _reset_server()
    {
        $_SERVER = [];
        return $this;
    }

    protected function _add_server($k,$v)
    {
        if(is_string($k)) $_SERVER[$k] = $v;
        return $this;
    }

    protected function _reset_fullrequest()
    {
        RequestHelper::reset();
        unset($_POST,$_GET,$_FILES,$_SERVER);
        $_POST=[]; $_GET=[]; $_FILES=[]; $_SERVER = [];
        return $this;
    }

    private function _get_dbname_by_env()
    {
        $env = cfg::get_env();
        if($env=="local") return "db_security";
        if($env=="prod") return "dbs433062";
        if($env=="test") return "dbXXXX";
    }

    protected function _get_db()
    {
        $dbname = $this->_get_dbname_by_env();
        $config = cfg::get_schema("c1", $dbname);
        return new MysqlComponent($config);
    }
}