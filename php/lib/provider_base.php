<?php
namespace TheFramework\Providers;

use TheFramework\Components\ComponentConfig;
use TheFramework\Components\Db\ComponentMysql;

class ProviderBase
{
    private $db;
    private $remoteip;

    public function __construct($remoteip)
    {
        $config = ComponentConfig::get_schema("c1","db_security");
        $this->db = new ComponentMysql($config);
        $this->remoteip = $remoteip;
    }

    public function is_blacklisted()
    {
        $sql = "
        -- is_blacklisted
        SELECT id FROM app_ip_blacklist WHERE remote_ip='$this->remoteip' AND is_blocked=1";
        $id = $this->db->query($sql,0,0);
        //print_r($id);
        return $id;
    }

    public function is_registered()
    {
        $sql = "
        -- is_registered
        SELECT id FROM app_ip WHERE remote_ip='$this->remoteip'";
        $id = $this->db->query($sql,0,0);
        return $id;
    }

    private function save_app_ip()
    {
        $sql = "
        -- save_app_ip 
        INSERT INTO app_ip (remote_ip) VALUES('$this->remoteip')";
        $this->db->exec($sql);
    }

    private function to_json($arvar)
    {
        if($arvar)
            return json_encode($arvar);
        return "";
    }

    public function save_request()
    {
        if(!$this->is_registered()) $this->save_app_ip();

        $requesturi = $_SERVER["REQUEST_URI"];
        $domain = $_SERVER['HTTP_HOST'];
        $get = $this->to_json($_GET);
        $post = $this->to_json($_POST);
        $files = $this->to_json($_FILES);

        $sql = "
        -- save_request
        INSERT INTO app_ip_request (remote_ip,domain,request_uri,post,get,files) 
        VALUES ('$this->remoteip','$domain','$requesturi','$post','$get','$files')";
        $this->db->exec($sql);
    }
}