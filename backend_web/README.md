# ipblocker - PHP
Gestion de bloqueo de ips en php  
php -S localhost:3100 -t php/public

### php
- [prod include](https://trello.com/c/5qbASalI/10-ipblocker)
```php
if(is_file("~/mi_common/prj_ipblocker/php/public/ipblocker.php"))
    include("~/mi_common/prj_ipblocker/php/public/ipblocker.php");
```
#### tests
```
vendor/bin/phpunit
vendor/bin/phpunit --migrate-configuration
```

### Historial
- Agrego tabla untracked ips para que no se guarde ninguna información de ciertas ips