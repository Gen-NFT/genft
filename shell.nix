{ pkgs ? import <nixpkgs> {} }:
let
  my-python = pkgs.python3;
  python-with-my-packages = my-python.withPackages (p: with p; [
    pip
    pillow
  ]);
in
pkgs.mkShell {
  buildInputs = [
    python-with-my-packages
    pkgs.figlet
  ];
  
  shellHook = ''
    figlet "Welcome to genLineArt"
  '';
}