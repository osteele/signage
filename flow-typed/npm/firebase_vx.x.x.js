// flow-typed signature: 1dd2bc099ea4e58fe372bc9ae1c37b02
// flow-typed version: <<STUB>>/firebase_v^3.7.4/flow_v0.45.0

// This contains slightly more than the bare minimum to support the
// embedding project.

declare module 'firebase' {
  declare class Auth {
    EmailAuthProvider(): AuthProvider;
    FacebookAuthProvider(): AuthProvider;
    GithubAuthProvider(): GithubAuthProvider;
    GoogleAuthProvider(): AuthProvider;
    TwitterAuthProvider(): AuthProvider;
    signInWithPopup(AuthProvider): Promise<?User>;
    signOut(): void;
    onAuthStateChanged((User) => void, ?FirebaseErrorHandler, ?(() => void)): void;
  }

  declare class AuthProvider {
    providerId: string;
  }

  declare class GithubAuthProvider extends AuthProvider {
    addScope: (string) => void;
  }

  declare class Database {
    static ServerValue: { TIMESTAMP: {} };
    ref(): Reference;
  }

  declare class DataSnapshot {
    key: ?string;
    parent: ?string;
    ref: Reference;
    child(Path): DataSnapshot;
    val(): mixed;
  }

  declare class FirebaseError {
    code: string;
    message: string;
    name: string;
    stack: ?string;
  }

  declare class Promise<T> {
    then((T) => void): Promise<T>;
    catch((T) => void): Promise<T>;
  }

  declare class Reference {
    key: ?string;
    parent: ?Reference;
    child(Path): Reference;
    on(EventType, ReferenceCallback, ?FirebaseErrorHandler): ReferenceCallback;
    once(EventType, ReferenceCallback, ?FirebaseErrorHandler): Promise<DataSnapshot>;
    off(EventType, ReferenceCallback): void;
    push({}, ?FirebaseErrorHandler): Reference;
    remove(?FirebaseErrorHandler): void;
    set(mixed, ?FirebaseErrorHandler): Promise<void>;
    setPriority(mixed, ?FirebaseErrorHandler): Promise<void>;
    toString(): string;
    update({}, ?FirebaseErrorHandler): Promise<void>;
  }

  declare class User {
    uid: string;
    displayName: string;
    email: string;
  }

  declare type FirebaseErrorHandler = (FirebaseError) => void;
  declare type EventType = "value" | "child_added" | "child_changed" | "child_removed" | "child_moved"
  declare type Path = string;
  declare type ReferenceCallback = (DataSnapshot) => void;

  declare function initializeApp({| |}): void;
  declare function auth(): Auth;
  declare function database(): Database;
}
