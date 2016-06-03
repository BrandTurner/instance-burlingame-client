<?php

require_once dirname(dirname(__FILE__)).'/vendor/autoload.php';

use CloudCompli\InstanceClient\OAuth2Provider;
use CloudCompli\InstanceClient\OAuth2Session;

$cloudcompliUrl = 'http://localhost/instance-honolulu/public';
$clientId = 'mobileid';
$clientSecret = 'mobilepass';
$scriptUrl = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['SERVER_NAME'].(($_SERVER['SERVER_PORT'] != '80' && $_SERVER['SERVER_PORT'] != '443') ? (':'.$_SERVER['SERVER_PORT']) : '').$_SERVER['SCRIPT_NAME'];

$provider = new OAuth2Provider([
    'clientId'                => $clientId,
    'clientSecret'            => $clientSecret,
    'redirectUri'             => $scriptUrl,
    'url'                     => $cloudcompliUrl
]);

// If we don't have an authorization code then get one
if (!isset($_GET['code'])) {

    // Fetch the authorization URL from the provider; this returns the
    // urlAuthorize option and generates and applies any necessary parameters
    // (e.g. state).
    $authorizationUrl = $provider->getAuthorizationUrl();

    // Redirect the user to the authorization URL.
    header('Location: ' . $authorizationUrl);
    exit;

} else {

    try {

        // Try to get an access token using the authorization code grant.
        $accessToken = $provider->getAccessToken('authorization_code', [
            'code' => $_GET['code'],
            'verify' => false
        ]);

        $session = new OAuth2Session($provider, $accessToken);
        $request = $session->getRequest('user');
        $authorization = $request->getHeader('Authorization');

        ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title></title>
    </head>
    <body>
        <script type="text/javascript">
            localStorage.setItem('api-authorization', '<?php echo $authorization[0]; ?>');
            window.location = 'index.html';
        </script>
    </body>
</html>

        <?php


    } catch (\League\OAuth2\Client\Provider\Exception\IdentityProviderException $e) {

        echo $e->getMessage();

    }

}