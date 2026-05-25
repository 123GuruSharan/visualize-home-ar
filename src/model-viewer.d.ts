/// <reference types="react" />

// Type declarations for the <model-viewer> custom element provided by
// @google/model-viewer. Allows JSX usage with TypeScript.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          alt?: string;
          ar?: boolean | "";
          "ar-modes"?: string;
          "ar-scale"?: string;
          "ar-placement"?: string;
          "camera-controls"?: boolean | "";
          "touch-action"?: string;
          "auto-rotate"?: boolean | "";
          "rotation-per-second"?: string;
          "shadow-intensity"?: string;
          "shadow-softness"?: string;
          "environment-image"?: string;
          "skybox-image"?: string;
          exposure?: string;
          poster?: string;
          loading?: "auto" | "lazy" | "eager";
          reveal?: "auto" | "interaction" | "manual";
          "disable-zoom"?: boolean | "";
          "interaction-prompt"?: "auto" | "when-focused" | "none";
        },
        HTMLElement
      >;
    }
  }
}

export {};
