
<a name="CredentialsManager"></a>

## CredentialsManager
Credentials Manager is a helper class which contains all the abstractions for creating
new credentials, DVID and revokation of credentials

**Kind**: global class  

* [CredentialsManager](#CredentialsManager)
    * [.create(props)](#CredentialsManager+create) ⇒ <code>Promise.&lt;Credential&gt;</code>
    * [.isCredentialValid(signedVc, issuerIdentity)](#CredentialsManager+isCredentialValid) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.verifyCredential(signedVc)](#CredentialsManager+verifyCredential) ⇒ <code>IVerificationResult</code>
    * [.revokeCredential(keyIndex)](#CredentialsManager+revokeCredential) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="CredentialsManager+create"></a>

### credentialsManager.create(props) ⇒ <code>Promise.&lt;Credential&gt;</code>
Create and issue a verifiable credential for someone

**Kind**: instance method of [<code>CredentialsManager</code>](#CredentialsManager)  

| Param | Type |
| --- | --- |
| props | <code>ICreateCredentialProps</code> | 

<a name="CredentialsManager+isCredentialValid"></a>

### credentialsManager.isCredentialValid(signedVc, issuerIdentity) ⇒ <code>Promise.&lt;boolean&gt;</code>
Validate a credential

**Kind**: instance method of [<code>CredentialsManager</code>](#CredentialsManager)  

| Param | Type | Description |
| --- | --- | --- |
| signedVc | <code>Credential</code> | signed VC that needs to be validated |
| issuerIdentity | <code>ResolvedDocument</code> | account it was signed with |

<a name="CredentialsManager+verifyCredential"></a>

### credentialsManager.verifyCredential(signedVc) ⇒ <code>IVerificationResult</code>
DVID v0.2.0
Domain Verifiable Identity is a module that allows you to verify the source of
origin for a verifiable credential, here are the steps to validate with DVID v0.2.0

- Parse the Document and look for the domain of origin
- Lookup TXT records for the domain of origin
- Resolve DID contained in DNS record and validate the credential

**Kind**: instance method of [<code>CredentialsManager</code>](#CredentialsManager)  

| Param | Type |
| --- | --- |
| signedVc | <code>Credential</code> | 

<a name="CredentialsManager+revokeCredential"></a>

### credentialsManager.revokeCredential(keyIndex) ⇒ <code>Promise.&lt;void&gt;</code>
Revoke a credential that has been issued, by revoking the method that was used to
sign the credential we are looking to revoke and make invalid.

WARNING: it will revoke the method that was attached to the credential thus any other
credentials signed using this keypair will also become invalid

**Kind**: instance method of [<code>CredentialsManager</code>](#CredentialsManager)  

| Param | Type | Description |
| --- | --- | --- |
| keyIndex | <code>Number</code> | Revoke the key at the index passed |


<a name="IdentityAccount"></a>

## IdentityAccount
Utitlity class to bind wrapper methods to an Identity Instance

**Kind**: global class  

* [IdentityAccount](#IdentityAccount)
    * [.getDid()](#IdentityAccount+getDid) ⇒ <code>DID</code>
    * [.getDocument()](#IdentityAccount+getDocument)
    * [.attachSigningMethod(fragment)](#IdentityAccount+attachSigningMethod) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.attachEncryptionMethod(fragment)](#IdentityAccount+attachEncryptionMethod) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.encryptData(plainText, fragment)](#IdentityAccount+encryptData) ⇒ <code>Promise.&lt;EncryptedData&gt;</code>
    * [.decryptData(encryptedData, fragment)](#IdentityAccount+decryptData) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="IdentityAccount+getDid"></a>

### identityAccount.getDid() ⇒ <code>DID</code>
Get the DID associated to the account

**Kind**: instance method of [<code>IdentityAccount</code>](#IdentityAccount)  
<a name="IdentityAccount+getDocument"></a>

### identityAccount.getDocument()
Get the Document associated to the Account

**Kind**: instance method of [<code>IdentityAccount</code>](#IdentityAccount)  
<a name="IdentityAccount+attachSigningMethod"></a>

### identityAccount.attachSigningMethod(fragment) ⇒ <code>Promise.&lt;void&gt;</code>
Manipulate a DID and attach a verification method to it

**Kind**: instance method of [<code>IdentityAccount</code>](#IdentityAccount)  

| Param | Type |
| --- | --- |
| fragment | <code>Fragment</code> | 

<a name="IdentityAccount+attachEncryptionMethod"></a>

### identityAccount.attachEncryptionMethod(fragment) ⇒ <code>Promise.&lt;void&gt;</code>
Manipulate the DID and attach an encryption method to it

**Kind**: instance method of [<code>IdentityAccount</code>](#IdentityAccount)  

| Param | Type | Description |
| --- | --- | --- |
| fragment | <code>Fragment</code> | fragment for the encryption method |

<a name="IdentityAccount+encryptData"></a>

### identityAccount.encryptData(plainText, fragment) ⇒ <code>Promise.&lt;EncryptedData&gt;</code>
Encrypt data and return it

**Kind**: instance method of [<code>IdentityAccount</code>](#IdentityAccount)  

| Param | Type | Description |
| --- | --- | --- |
| plainText | <code>String</code> | data to be encrypted |
| fragment | <code>Fragment</code> | fragment to encrypt data with |

<a name="IdentityAccount+decryptData"></a>

### identityAccount.decryptData(encryptedData, fragment) ⇒ <code>Promise.&lt;string&gt;</code>
Decrypt the data

**Kind**: instance method of [<code>IdentityAccount</code>](#IdentityAccount)  

| Param | Type | Description |
| --- | --- | --- |
| encryptedData | <code>EncryptedData</code> \| <code>JSON</code> | data to decrypt |
| fragment | <code>Fragment</code> | fragment to decrypt the data with |


<a name="IdentityManager"></a>

## IdentityManager
IdentityManager is a utility class which handles management of secrets and
DID documents stored inside of one stronghold backup, private constructor needs
a path and password

**Kind**: global class  

* [IdentityManager](#IdentityManager)
    * [new IdentityManager(filepath, password)](#new_IdentityManager_new)
    * _instance_
        * [.getIdentityConfig()](#IdentityManager+getIdentityConfig) ⇒ <code>Array.&lt;IdentityConfig&gt;</code>
        * [.getDid(did)](#IdentityManager+getDid) ⇒ [<code>Promise.&lt;IdentityAccount&gt;</code>](#IdentityAccount)
        * [.createDid(props)](#IdentityManager+createDid) ⇒ [<code>Promise.&lt;IdentityAccount&gt;</code>](#IdentityAccount)
        * [.getIdentityByAlias(alias)](#IdentityManager+getIdentityByAlias) ⇒ [<code>Promise.&lt;IdentityAccount&gt;</code>](#IdentityAccount)
    * _static_
        * [.newInstance(props)](#IdentityManager.newInstance) ⇒ [<code>Promise.&lt;IdentityManager&gt;</code>](#IdentityManager)

<a name="new_IdentityManager_new"></a>

### new IdentityManager(filepath, password)
Constructor to create an instance of the class


| Param | Type |
| --- | --- |
| filepath | <code>String</code> | 
| password | <code>String</code> | 

<a name="IdentityManager+getIdentityConfig"></a>

### identityManager.getIdentityConfig() ⇒ <code>Array.&lt;IdentityConfig&gt;</code>
Get the IdentityConfig document stored on a JSON

**Kind**: instance method of [<code>IdentityManager</code>](#IdentityManager)  
<a name="IdentityManager+getDid"></a>

### identityManager.getDid(did) ⇒ [<code>Promise.&lt;IdentityAccount&gt;</code>](#IdentityAccount)
Load a DID stored in the same stronghold path as the one configured

**Kind**: instance method of [<code>IdentityManager</code>](#IdentityManager)  

| Param | Type |
| --- | --- |
| did | <code>DID</code> | 

<a name="IdentityManager+createDid"></a>

### identityManager.createDid(props) ⇒ [<code>Promise.&lt;IdentityAccount&gt;</code>](#IdentityAccount)
Create a new DID in the stronghold path as the one configured

**Kind**: instance method of [<code>IdentityManager</code>](#IdentityManager)  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>IIdentityManagerProps</code> | Alias for the identity |

<a name="IdentityManager+getIdentityByAlias"></a>

### identityManager.getIdentityByAlias(alias) ⇒ [<code>Promise.&lt;IdentityAccount&gt;</code>](#IdentityAccount)
Gets an account by the alias stored in the config

**Kind**: instance method of [<code>IdentityManager</code>](#IdentityManager)  

| Param |
| --- |
| alias | 

<a name="IdentityManager.newInstance"></a>

### IdentityManager.newInstance(props) ⇒ [<code>Promise.&lt;IdentityManager&gt;</code>](#IdentityManager)
Get the instance of IdentityManager, it will create a new instance of the class
shall one not already exist

**Kind**: static method of [<code>IdentityManager</code>](#IdentityManager)  

| Param | Type |
| --- | --- |
| props | <code>IIdentityManagerProps</code> | 

