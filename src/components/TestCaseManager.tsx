import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTestCaseStore } from '@/store/testCaseStore'
import { useAuthStore } from '@/store/authStore'
import { useThermoStore } from '@/store/thermoStore'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play,
  Database,
  Zap,
  Flame,
  Wind
} from 'lucide-react'

export function TestCaseManager() {
  const { isAuthenticated } = useAuthStore()
  const { 
    testCases, 
    isLoading, 
    error, 
    loadTestCases, 
    createTestCase, 
    updateTestCase, 
    deleteTestCase,
    clearError
  } = useTestCaseStore()
  
  const { 
    cycleType,
    fluid,
    parameters,
    setCycleType,
    setFluid,
    setParameters
  } = useThermoStore()
  
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestCase, setEditingTestCase] = useState<any>(null)
  const [testCaseName, setTestCaseName] = useState('')
  const [testCaseDescription, setTestCaseDescription] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      loadTestCases()
    }
  }, [isAuthenticated, loadTestCases])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      })
      clearError()
    }
  }, [error, toast, clearError])

  const handleSaveTestCase = async () => {
    if (!testCaseName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your test case",
        variant: "destructive"
      })
      return
    }

    const testCaseData = {
      name: testCaseName.trim(),
      description: testCaseDescription.trim(),
      cycle_type: cycleType,
      fluid_properties: fluid,
      parameters
    }

    const result = editingTestCase 
      ? await updateTestCase(editingTestCase.id, testCaseData)
      : await createTestCase(testCaseData)

    if (result.success) {
      toast({
        title: "Success",
        description: editingTestCase 
          ? "Test case updated successfully" 
          : "Test case saved successfully"
      })
      setIsDialogOpen(false)
      resetForm()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to save test case",
        variant: "destructive"
      })
    }
  }

  const handleLoadTestCase = (testCase: any) => {
    setCycleType(testCase.cycle_type)
    setFluid(testCase.fluid_properties)
    setParameters(testCase.parameters)
    
    toast({
      title: "Test Case Loaded",
      description: `${testCase.name} has been loaded successfully`
    })
  }

  const handleEditTestCase = (testCase: any) => {
    setEditingTestCase(testCase)
    setTestCaseName(testCase.name)
    setTestCaseDescription(testCase.description)
    setIsDialogOpen(true)
  }

  const handleDeleteTestCase = async (id: string, name: string) => {
    const result = await deleteTestCase(id)
    if (result.success) {
      toast({
        title: "Test Case Deleted",
        description: `${name} has been deleted successfully`
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete test case",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setEditingTestCase(null)
    setTestCaseName('')
    setTestCaseDescription('')
  }

  const getCycleIcon = (cycleType: string) => {
    switch (cycleType) {
      case 'otto': return <Zap className="w-4 h-4" />
      case 'diesel': return <Flame className="w-4 h-4" />
      case 'brayton': return <Wind className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Test Case Manager
          </CardTitle>
          <CardDescription>
            Sign in to save and manage your test cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create an account to save your thermodynamic cycle configurations and access them from anywhere.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Test Cases
            </CardTitle>
            <CardDescription>
              Save and manage your cycle configurations
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Save Current
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTestCase ? 'Edit Test Case' : 'Save Test Case'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-case-name">Name</Label>
                  <Input
                    id="test-case-name"
                    value={testCaseName}
                    onChange={(e) => setTestCaseName(e.target.value)}
                    placeholder="Enter test case name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="test-case-description">Description</Label>
                  <Textarea
                    id="test-case-description"
                    value={testCaseDescription}
                    onChange={(e) => setTestCaseDescription(e.target.value)}
                    placeholder="Describe this test case (optional)"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveTestCase}>
                    {editingTestCase ? 'Update' : 'Save'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : testCases.length === 0 ? (
          <div className="text-center py-8">
            <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No test cases saved yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Save your current configuration to get started
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testCases.map((testCase) => (
                  <TableRow key={testCase.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{testCase.name}</div>
                        {testCase.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {testCase.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        {getCycleIcon(testCase.cycle_type)}
                        {testCase.cycle_type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(testCase.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleLoadTestCase(testCase)}
                            className="gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Load
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEditTestCase(testCase)}
                            className="gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteTestCase(testCase.id, testCase.name)}
                            className="gap-2 text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}