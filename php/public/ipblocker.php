<?php
//ipblocker.php
$pathlib = realpath(__DIR__."/../lib");
$pathconfig = realpath(__DIR__."/../../config");
$pathlogs = realpath(__DIR__."/../../logs");
define("IPB_ENABLE_LOGS",0);
define("IPB_PATH_CONFIG",$pathconfig);
define("IPB_PATH_LOGS",$pathlogs);
//die(PATH_LIB);
//die("pathlib:$pathlib");
include("$pathlib/functions.php");
include("$pathlib/component_log.php");
include("$pathlib/trait_log.php");
include("$pathlib/helper_request.php");
include("$pathlib/component_config.php");
include("$pathlib/component_mysql.php");
include("$pathlib/component_mailing.php");
include("$pathlib/provider_base.php");
include("$pathlib/component_ipblocker.php");

$o = new \TheFramework\Components\ComponentIpblocker();
$o->handle_request();
