<?php
namespace App\Tests\Unit\Providers;

use App\Tests\Unit\BaseTest;
use Ipblocker\Providers\BaseProvider;

class BaseProviderTest extends BaseTest
{
    private const IP_UNATRACKED = "127.0.0.1";

    private function _add_untracked()
    {
        $db = $this->_get_db();
        $arsql[] = sprintf("DELETE FROM app_ip_untracked WHERE remote_ip='%s'",self::IP_UNATRACKED);
        $arsql[] = sprintf("INSERT INTO app_ip_untracked (remote_ip) VALUES('%s')",self::IP_UNATRACKED);
        $sql = implode(";",$arsql);
        $db->exec($sql);
        if($db->is_error())
            $this->logd($db->get_errors(),"_add_untracked.errors");
    }
    public function test_isuntracked()
    {
        $this->_add_untracked();
        $_SERVER["REMOTE_ADDR"] = self::IP_UNATRACKED;
        $prov = new BaseProvider();
        $r = $prov->is_untracked();
        $this->assertTrue(($r>0));
    }
    
    public function est_ipblocker()
    {
        $this->_add_untracked();
        $_SERVER["REMOTE_ADDR"] = self::IP_UNATRACKED;
        $prov = new BaseProvider();
        $r = $prov->is_blacklisted();
        $this->logd($r,"test_ipblocker");
        $this->assertTrue($r);
    }
}