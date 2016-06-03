<?php

$cloudcompliUrl = 'http://localhost/instance-honolulu/public';
$clientId = 'mobileid';
$clientSecret = 'mobilepass';
$scriptUrl = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['SERVER_NAME'].(($_SERVER['SERVER_PORT'] != '80' && $_SERVER['SERVER_PORT'] != '443') ? (':'.$_SERVER['SERVER_PORT']) : '').$_SERVER['SCRIPT_NAME'];