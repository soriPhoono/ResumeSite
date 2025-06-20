{
  description = "Description for the project";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    naersk = {
      url = "github:nix-community/naersk";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    flake-utils,
    nixpkgs,
    fenix,
    naersk,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      target-desc = [
        "x86_64-unknown-linux-gnu"
        "wasm32-unknown-unknown"
      ];
      toolchain = with fenix.packages.${system};
        combine ([
            stable.cargo
            stable.rustc
          ]
          ++ (map (target: targets.${target}.stable.rust-std) target-desc));
    in {
      packages.default =
        (naersk.lib.${system}.override {
          cargo = toolchain;
          rustc = toolchain;
        }).buildPackage {
          src = ./.;
        };

      devShells.default = with pkgs;
        mkShell {
          packages = [
            toolchain
            trunk
            dart-sass
            leptosfmt
          ];
        };
    });
}
