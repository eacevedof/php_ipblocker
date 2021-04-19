<?php
namespace Ipblocker\Services\Rulez;
use Ipblocker\Rulez;

use Ipblocker\Components\ComponentsString;
use Ipblocker\Components\ComponentsArray;

class UrlService implements IRulez
{

    private string $requrl;
    private array $arrulez;

    public function __construct(string $requrl, array $arrulez)
    {
        $this->requrl = new ComponentString($requrl);
        $this->arrulez = new ArrayComponent($arrulez);
    }

    public function get()
    {
        // comprobar filtro global por:
        // request uri
        // get keys
        // get values
        // post keys
        // post values
        // TODO: Implement validate() method.
    }
}