declare module "front-matter" {
  interface FrontMatterResult<T> {
    attributes: T;
    body: string;
  }

  export default function fm<T = any>(input: string): FrontMatterResult<T>;
}
