{ pkgs ? import <nixpkgs> {} }:
let
  my-python = pkgs.python3;
  python-with-my-packages = my-python.withPackages (p: with p; [
    pip
    pillow
    requests

  ]);
in
pkgs.mkShell {
  buildInputs = [
    python-with-my-packages
    pkgs.figlet
    pkgs.nodejs
  ];
  
  shellHook = ''
    figlet "Welcome to genLineArt"
  '';
}