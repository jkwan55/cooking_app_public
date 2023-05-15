import { gql } from '@apollo/client';

export const CREATE_CLIENT = gql`
        mutation Register($username: String!, $password: String!) {
            register(username: $username, password1: $password, password2: $password, email: ""){
                success,
                errors,
                token,
                refreshToken
            }
        }
    `;

export const LOGIN_CLIENT = gql`
    mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            success,
            errors,
            token,
            refreshToken,
            user {
                id,
                username,
            }
        }
    }
`;

export const VERIFY_TOKEN = gql`
    mutation VerifyToken($token: String!) {
        verifyToken(token: $token) {
            success
            errors
            payload
        }
    }
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
            token,
            payload,
            success,
            errors,
            refreshToken
        }
    }
`;    
