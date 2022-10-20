# Identity Manager

IdentityManager is a utility library that acts as a wrapper around most IOTA Identity functions and provides an easier and more comprehensive experience to manager your identities.

On top of simply managing your DID, the IdentityManager also combines the power of stronghold and DVID (Domain Verifiable Identity).

DVID verification connects your DID to a record on a domain's DNS, inspired by the DKIM protocol, you add your DID to a text record on the domain's DNS and during verification of a credential the issuer's DID is resolved from the dns record of the domain mentioned in the `id` field in the credential, Adding proof of origin to a Verifiable Credential.

# What is Self-Sovereign Identity?

In the sharing of digital data, SSI fosters trust. The user has discretion over what information, including personal information, is shared and with whom. For instance, the recipient can rapidly check the legality and authenticity of shared information electronically. For this, cryptographic tools like public-key cryptography, zero-knowledge proofs, and distributed ledger technologies are used. This makes it possible for parties who do not naturally trust each other to share verified digital information quickly and with a high level of trust.



![The Self-Sovereign Identity Ecosystem using Identity Manager](https://tanglelabs.io/wp-content/uploads/2022/09/image-2048x1445.png)


## Additional features include:

DVID – Domain Verifiable Identity, making use of DNS and inspired by DKIM, DVID allows a verifiable credential to be signed and verified not only through its issuers DID, but also through its issuer’s domain through the use of DNS connected DID. Providing a built in human identifiable verification process.

Storage Interface – Through the addition of a storage interface, Identity Manager can easily allow developers to quickly adapt the technology to any data storage paradigm, allowing for ease of management of your identity and credentials through the built in MongoDB or File System solutions, or through any number of additional data storage options such as Postgress, SQL, Cassandra, etc.

Credential Encryption – There are currently no suggested guidelines for the encryption of data in the IOTA Identity protocols, which has been included in the Identity Manager toolkit. Ensuring an identity is fully supported with encrypted credential storage accessible through ownership DID key access. Supporting users with safe storage of their PII only accessible through your private key.

Backup & Restore – A big concern when it comes to identity is backing up and restoration of data when something goes wrong. You break a phone, your laptop burns out, any number of things can add to the loss of data. Identity Manager supports easy user backup and restoration for peace of mind, allowing identity holders to safely be able to restore identity configurations, credentials, keys, and more.

Typescript Library – Without the need to delve into low level Rust code, the Identity Manager libraries have been developed in Typescript to provide an accessible developer entry point to SSI through fully documented code that offers an easy access point to the technology for any development team.



## Usage

IdentityManager can be installed using

```
$ npm install @tanglelabs/identity-manager
```

or

```
$ yarn add @tanglelabs/identity-manager
```

you can then add it to your project and use it

```ts
import { IdentityManager } from "@tanglelabs/identity-manager";

async function run() {
    const manager = await IdentityManager.newInstance({
        filepath: "./identity"
        password: process.env.IDENTITY_PASSWORD
    });
    const did = await manager.createDid("identity-alias");
}

run();
```

## Documentation

- see [API Reference](docs/api-ref.md)
- see [examples](docs/examples)


