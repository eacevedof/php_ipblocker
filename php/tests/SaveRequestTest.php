<?php
include("BaseTest.php");
use Tests\BaseTest;
use \TheFramework\Components\ComponentIpblocker;


final class SaveRequestTest extends BaseTest
{

    private function pr()
    {
        //print_r($_POST);
        //print_r($_GET);
        //print_r($_FILES);
    }

    private function _execute_ipblocker($i)
    {
        (new ComponentIpblocker())->test_handle_request($i);
    }

    private function _test_blocked_get()
    {
        $this->reset_all()->
            add_get("","=ftp://")
            ->add_get("content","die(@md5(");

        $this->log_globals();
        $this->_execute_ipblocker("_test_blocked_get");
    }

    private function _test_non_blocked_get()
    {
        $this->reset_all()->
        add_get("","ftp://")
            ->add_get("content","(@md5(");

        $this->log_globals();
        $this->_execute_ipblocker("_test_non_blocked_get");
    }

    public function run()
    {
        $this->_test_non_blocked_get();
        $this->_test_blocked_get();
    }
}

//otra forma es lanzar: php -S localhost:2000 -t public
if (!count(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS)))
    (new SaveRequestTest())->run();
