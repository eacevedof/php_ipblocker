<?php
//ipblocker.php
include("../lib/functions.php");
include("../lib/component_mysql.php");
include("../lib/component_mailing.php");
include("../lib/provider_base.php");
include("../lib/component_ipblocker.php");


$o = new \TheFramework\Components\ComponentIpblocker();
$o->handle_request();

