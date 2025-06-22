{pkgs ? import <nixpkgs> {}, ...}: {
  projectRootFile = "flake.nix";

  programs = {
    alejandra.enable = true;
    deadnix.enable = true;
    statix.enable = true;
    biome.enable = true;
    rustfmt.enable = true;
    leptosfmt.enable = true;
  };

  settings.formatter = {
    leptosfmt = {
      command = "${pkgs.leptosfmt}/bin/leptosfmt";
      options = [
        "./**/*.rs"
      ];
      includes = ["*.rs"];
    };
  };
}
