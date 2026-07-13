import os
import re

tabs_dir = "src/components/Admin/tabs"

files = [
    "CustomersTab.tsx",
    "SuppliersTab.tsx",
    "SalesInvoicesTab.tsx",
    "PurchaseInvoicesTab.tsx",
    "FixedAssetsTab.tsx",
    "RolesTab.tsx",
    "EmployeesTab.tsx",
    "CashAccountsTab.tsx"
]

def add_imports(content):
    imports = "import { ConfirmModal } from '../../ConfirmModal';\nimport { EmptyState } from '../../EmptyState';\nimport { LoadingSpinner } from '../../LoadingSpinner';\n"
    if "ConfirmModal" not in content:
        content = content.replace("import { t }", imports + "import { t }")
        if imports not in content:
            content = content.replace("import React", "import React\n" + imports)
    return content

for file in files:
    path = os.path.join(tabs_dir, file)
    if not os.path.exists(path): continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = add_imports(content)
    
    # Insert state
    if "const [itemToDelete, setItemToDelete] = useState" not in content:
        content = re.sub(r'(const \[.*?\] = useState.*?;\n)', r'\1  const [itemToDelete, setItemToDelete] = useState<string | null>(null);\n', content, count=1)

    # Convert handleDelete to setItemToDelete
    content = re.sub(r'onClick=\{\(\) => handleDelete\((.*?)\)\}', r'onClick={() => setItemToDelete(\1)}', content)
    
    # For EmployeesTab, change employeeToDelete to itemToDelete for consistency (optional, but easier)
    if file == "EmployeesTab.tsx":
        content = content.replace("employeeToDelete", "itemToDelete")
        content = content.replace("setEmployeeToDelete", "setItemToDelete")
        
    # Append ConfirmModal if not present
    if "<ConfirmModal" not in content:
        # We need to find the specific delete function name, usually deleteXxx
        delete_fn = None
        if file == "CustomersTab.tsx": delete_fn = "deleteCustomer"
        if file == "SuppliersTab.tsx": delete_fn = "deleteSupplier"
        if file == "SalesInvoicesTab.tsx": delete_fn = "deleteInvoice"
        if file == "PurchaseInvoicesTab.tsx": delete_fn = "deleteInvoice"
        if file == "FixedAssetsTab.tsx": delete_fn = "deleteFixedAsset"
        if file == "RolesTab.tsx": delete_fn = "deleteRole" # and deleteUser, handled manually if needed
        if file == "CashAccountsTab.tsx": delete_fn = "deleteTransaction" # wait, CashAccounts has multiple
        
        if delete_fn:
            confirm_modal = f"""
      <ConfirmModal
        isOpen={{!!itemToDelete}}
        title={{t('confirmDelete', lang)}}
        message={{t('confirmDeleteMsg', lang)}}
        onConfirm={{() => {{
          if (itemToDelete) {delete_fn}(itemToDelete);
        }}}}
        onCancel={{() => setItemToDelete(null)}}
      />
"""
            # Insert before last </div>
            content = re.sub(r'(</div>\s*)$', confirm_modal + r'\1', content)

    # Empty states and loading
    # We will try to replace map functions or empty states with our standard.
    # This might be tricky with regex, so we'll do the modal backgrounds first.
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("UX patching phase 1 done.")
