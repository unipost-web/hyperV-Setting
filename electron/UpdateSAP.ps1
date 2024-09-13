param (
    [string]$serviceName,
    [string]$systemId,
    [string]$server,
    [string]$workspaceName
)

$OutputEncoding = [System.Text.Encoding]::UTF8

# Get the current user's AppData path
$appDataPath = [System.Environment]::GetFolderPath('ApplicationData')

# Define the path for SAPUILandscape.xml and backup file
$xmlPath = "$appDataPath\SAP\Common\SAPUILandscape.xml"
$backupPath = "$appDataPath\SAP\Common\SAPUILandscape_Back.xml"

# Check if the XML file exists
if (Test-Path $xmlPath) {
    try {
        # Create a backup of the XML file
        if (Test-Path $backupPath) {
            Remove-Item $backupPath -Force
        }
        Copy-Item $xmlPath $backupPath
        Write-Host "Backup created successfully at $backupPath"

        # Load XML file
        [xml]$xml = [System.Xml.XmlDocument]::new()
        $xml.Load($xmlPath)

        # Check and create Workspaces element if missing
        $workspaces = $xml.SelectSingleNode("//Workspaces")
        if ($workspaces -eq $null) {
            Write-Host "Workspaces element is missing. Creating new Workspaces element."
            $workspaces = $xml.CreateElement("Workspaces")
            $xml.DocumentElement.AppendChild($workspaces) | Out-Null
        }

        # Check and create Services element if missing
        $services = $xml.SelectSingleNode("//Services")
        if ($services -eq $null) {
            Write-Host "Services element is missing. Creating new Services element."
            $services = $xml.CreateElement("Services")
            $xml.DocumentElement.AppendChild($services) | Out-Null
        }

        # Create a new Service entry
        $newService = $xml.CreateElement("Service")
        $newService.SetAttribute("type", "SAPGUI")
        $newService.SetAttribute("uuid", [guid]::NewGuid().ToString())
        $newService.SetAttribute("name", $serviceName)
        $newService.SetAttribute("systemid", $systemId)
        $newService.SetAttribute("mode", "1")
        $newService.SetAttribute("server", $server)
        $newService.SetAttribute("sncop", "-1")
        $newService.SetAttribute("sapcpg", "1100")
        $newService.SetAttribute("dcpg", "2")

        # Add the new service entry to the Services element
        $services.AppendChild($newService) | Out-Null
        Write-Host "New service entry added successfully."

        # Create a new Item entry
        $newItem = $xml.CreateElement("Item")
        $newItem.SetAttribute("uuid", [guid]::NewGuid().ToString())
        $newItem.SetAttribute("serviceid", $newService.GetAttribute("uuid"))

        # Find the specified Workspace by name
        $workspace = $workspaces.SelectSingleNode("//Workspace[@name='$workspaceName']")
        if ($workspace -eq $null) {
            Write-Host "Workspace with name '$workspaceName' not found. Creating a new Workspace."
            $workspace = $xml.CreateElement("Workspace")
            $workspace.SetAttribute("uuid", [guid]::NewGuid().ToString())
            $workspace.SetAttribute("name", $workspaceName)
            $workspaces.AppendChild($workspace) | Out-Null
        }

        # Add the new Item entry to the Workspace
        $workspace.AppendChild($newItem) | Out-Null
        Write-Host "New item added successfully to Workspace '$workspaceName'."

        # Save the updated XML file
        $xml.Save($xmlPath)
        Write-Host "XML file saved successfully."

    } catch {
        Write-Host "Error: $($_.Exception.Message)"
    }
} else {
    Write-Host "SAPUILandscape.xml file not found."
}
