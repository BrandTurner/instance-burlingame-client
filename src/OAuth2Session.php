<?php

namespace CloudCompli\InstanceClient;

use CloudCompli\InstanceClient\OAuth2Provider;
use League\OAuth2\Client\Token\AccessToken;

class OAuth2Session
{
    protected $provider;
    protected $accessToken;
    
    public function __construct(OAuth2Provider $provider, AccessToken $accessToken)
    {
        $this->provider = $provider;
        $this->accessToken = $accessToken;
    }
    
    public function makeUrl($path)
    {
        if(substr($path, 0, 1) != '/')
            $path = '/'.$path;
        
        return $this->provider->getBaseApiUrl().$path;
    }
    
    public function getRequest($path)
    {
        $request = $this->provider->getAuthenticatedRequest(
            'GET',
            $this->makeUrl($path),
            $this->accessToken,
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'verify' => false
            ]
        );
        
        return $request;
    }
    
    public function postRequest($path, $data)
    {
        $request = $this->provider->getAuthenticatedRequest(
            'POST',
            $this->makeUrl($path),
            $this->accessToken,
            [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'body' => json_encode($data),
                'verify' => false
            ]
        );
        
        return $request;
    }
    
    public function get($path)
    {
        return $this->provider->getResponseObject($this->getRequest($path));
    }
    
    public function post($path, $data)
    {
        return $this->provider->getResponseObject($this->postRequest($path, $data));
    }
}