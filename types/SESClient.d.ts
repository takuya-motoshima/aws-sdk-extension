import SESOptions from '~/interfaces/SESOptions';
/**
 * AWS SES email sending client.
 */
export default class SESClient {
    #private;
    /**
     * Constructs a SES client object.
     */
    constructor(options: SESOptions);
    /**
     * Set the sender's email address.
     * @param {string} from Sender's email address.
     * @param {string} name? Sender Name.
     * @return {SESClient}
     */
    from(from: string, name?: string): SESClient;
    /**
     * Set the destination email address.
     * @param {(string|string[])} to Email address to be sent to.
     * @return {SESClient}
     */
    to(to: string | string[]): SESClient;
    /**
     * Set CC email address.
     * @param {(string|string[])} cc CC email address.
     * @return {SESClient}
     */
    cc(cc: string | string[]): SESClient;
    /**
     * Set the email subject.
     * @param {string} subject Email Subject.
     * @return {SESClient}
     */
    subject(subject: string): SESClient;
    /**
     * Set the body of the email.
     * @param {string} body Email Body. The body can use the <a href="https://handlebarsjs.com/">handlebars</a> and <a href="https://www.npmjs.com/package/handlebars-extd">handlebars-extd</a> syntax.
     * @param {{[key: string]: any}} vars The value of a variable in the body of the e-mail.
     * @return {SESClient}
     */
    body(body: string, vars?: {
        [key: string]: any;
    }): SESClient;
    /**
     * Send email.
     * @param {'text'|'html'} type E-Mail type ('html': HTML mail, 'text': text mail). Default is 'text'.
     * @return {Promise<string>} Unique ID assigned by Amazon SES for a successfully sent email.
     */
    send(type?: 'text' | 'html'): Promise<string>;
}
