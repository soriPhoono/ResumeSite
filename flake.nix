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
  };

  outputs = {
    flake-utils,
    treefmt-nix,
    nixpkgs,
    fenix,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      inherit (nixpkgs) lib;
      pkgs = nixpkgs.legacyPackages.${system};

      treefmt = treefmt-nix.lib.evalModule pkgs ./treefmt.nix;

      target-names = [
        "x86_64-unknown-linux-gnu"
        "wasm32-unknown-unknown"
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

      dependencies = with pkgs; [
        nodejs
        trunk
        dart-sass
        toolchain
      ];
    in {
      formatter = treefmt.config.build.wrapper;

      packages.default = pkgs.writeShellApplication {
        name = "resume_page";
        runtimeInputs = dependencies;
        text = ''
          cd frontend && trunk build && cd ..
          cargo run --bin backend
        '';
      };

      devShells.default = with pkgs;
        mkShell {
          packages = dependencies;
        };
    });
}
