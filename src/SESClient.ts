import * as AWS from '@aws-sdk/client-ses';
import hbs from 'handlebars-extd';
import libmime from 'libmime';
import SESOptions from '~/interfaces/SESOptions';

/**
 * AWS SES email sending client.
 */
export default class SESClient {
  /**
   * SES Client.
   * @type {AWS.SESClient}
   */
  #client: AWS.SESClient;

  /**
   * Sender's email address.
   * @type {string}
   */
  #from?: string;

  /**
   * Email address to be sent to.
   * @type {string[]}
   */
  #to?: string[];

  /**
   * CC email address.
   * @type {string[]}
   */
   #cc?: string[];

  /**
   * Email Subject.
   * @type {string}
   */
   #subject?: string;

  /**
   * Email body.
   * @type {string}
   */
   #body?: string;

  /**
   * Constructs a SES client object.
   */
  constructor(options: SESOptions) {
    // Initialize options.
    options = Object.assign({
      apiVersion: 'latest',
    }, options);

    // Generate AWS SES Client.
    this.#client = new AWS.SESClient({
      apiVersion: options.apiVersion,
      region: options.region,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  /**
   * Set the sender's email address.
   * @param {string} from Sender's email address.
   * @param {string} name? Sender Name.
   * @return {SESClient}
   */
  from(from: string, name?: string): SESClient {
    if (name) {
      // MIME encoding to prevent garbled double-byte sender names.
      name = libmime.encodeWord(name, 'Q');
      this.#from = `${name} <${from}>`;
    } else
      this.#from = from;
    return this;
  }

  /**
   * Set the destination email address.
   * @param {(string|string[])} to Email address to be sent to.
   * @return {SESClient}
   */
  to(to: string|string[]): SESClient {
    if (typeof to === 'string')
      to = [to];
    this.#to = to;
    return this;
  }

  /**
   * Set CC email address.
   * @param {(string|string[])} cc CC email address.
   * @return {SESClient}
   */
  cc(cc: string|string[]): SESClient {
    if (typeof cc === 'string')
      cc = [cc];
    this.#cc = cc;
    return this;
  }

  /**
   * Set the email subject.
   * @param {string} subject Email Subject.
   * @return {SESClient}
   */
  subject(subject: string): SESClient {
    this.#subject = subject;
    return this;
  }

  /**
   * Set the body of the email.
   * @param {string} body Email Body. The body can use the <a href="https://handlebarsjs.com/">handlebars</a> and <a href="https://www.npmjs.com/package/handlebars-extd">handlebars-extd</a> syntax.
   * @param {{[key: string]: any}} vars The value of a variable in the body of the e-mail.
   * @return {SESClient}
   */
  body(body: string, vars?: {[key: string]: any}): SESClient {
    if (typeof vars === 'object')
      this.#body = hbs.compile(body)(vars);
    else
      this.#body = body;
    return this;
  }

  /**
   * Send email.
   * @param {'text'|'html'} type E-Mail type ('html': HTML mail, 'text': text mail). Default is 'text'.
   * @return {Promise<string>} Unique ID assigned by Amazon SES for a successfully sent email.
   */
  async send(type: 'text'|'html' = 'text'): Promise<string> {
    try {
      // Check email sending parameters.
      if (!this.#from || !this.#to || !this.#subject || !this.#body)
        throw new TypeError('The parameters from, to, subject, and body are required');

      // Parameters for sending mail.
      const params: AWS.SendEmailCommandInput = {
        Destination: {
          ToAddresses: this.#to,
          CcAddresses: this.#cc,
        },
        Message: {
          Body: {
            [type === 'text' ? 'Text' : 'Html']: {Charset: 'UTF-8', Data: this.#body}
          },
          Subject: {
            Charset: 'UTF-8',
            Data: this.#subject
          }
        },
        Source: this.#from
      };

      // Send email.
      const res = await this.#client.send(new AWS.SendEmailCommand(params));
      return res.MessageId as string;
    } finally {
      this.#reset();
    }
  }

  /**
   * Clear sent information after sending mail.
   */
  #reset() {
    this.#from = undefined;
    this.#to = undefined;
    this.#cc = undefined;
    this.#subject = undefined;
    this.#body = undefined;
  }
}