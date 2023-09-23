export default interface CommandLineArguments { 
    address?: string;
    method?: 'POST' | 'GET' | 'PATCH' | 'DELETE';
    body?: string;
}