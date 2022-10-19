# Identity Manager

IdentityManager is a utility library that acts as a wrapper around most IOTA Identity functions and provides an easier and more comprehensive experience to manager your identities.

On top of simply managing your DID, the IdentityManager also combines the power of stronghold and DVID (Domain Verifiable Identity).

DVID verification connects your DID to a record on a domain's DNS, inspired by the DKIM protocol, you add your DID to a text record on the domain's DNS and during verification of a credential the issuer's DID is resolved from the dns record of the domain mentioned in the `id` field in the credential, Adding proof of origin to a Verifiable Credential.

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

# What is Self-Sovereign Identity?

In the sharing of digital data, SSI fosters trust. The user has discretion over what information, including personal information, is shared and with whom. For instance, the recipient can rapidly check the legality and authenticity of shared information electronically. For this, cryptographic tools like public-key cryptography, zero-knowledge proofs, and distributed ledger technologies are used. This makes it possible for parties who do not naturally trust each other to share verified digital information quickly and with a high level of trust.

