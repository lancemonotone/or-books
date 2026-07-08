# Symlink discovery screenshots into audit/media (Windows).
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Source = if ($args[0]) { $args[0] } else { Join-Path $Root "..\_office\screenshots" }
$Target = Join-Path $Root "media"

if (-not (Test-Path $Source)) {
  Write-Error "Source not found: $Source"
  exit 1
}

New-Item -ItemType Directory -Force -Path $Target | Out-Null

$count = 0
Get-ChildItem $Source -Include *.png, *.mp4 | ForEach-Object {
  $link = Join-Path $Target $_.Name
  if (Test-Path $link) { Remove-Item $link -Force }
  New-Item -ItemType SymbolicLink -Path $link -Target $_.FullName | Out-Null
  $count++
}

Write-Host "Linked $count media files into audit/media"
