{
  description = "Description for the project";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    treefmt-nix.url = "github:numtide/treefmt-nix";

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
    treefmt-nix,
    nixpkgs,
    fenix,
    naersk,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      inherit (nixpkgs) lib;
      pkgs = nixpkgs.legacyPackages.${system};

      treefmt = treefmt-nix.lib.evalModule pkgs ./treefmt.nix;

      target-names = [
        "x86_64-unknown-linux-gnu"
      ];
      toolchain = with fenix.packages.${system};
        combine ([
            stable.cargo
            stable.rustc
          ]
          ++ (lib.flatten (map (target: [
              targets.${target}.stable.rust-src
              targets.${target}.stable.rust-std
            ])
            target-names)));
    in {
      formatter = treefmt.config.build.wrapper;

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
          ];
        };
    });
}
