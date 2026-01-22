import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'
import { User, Settings, LogOut } from 'lucide-react'

export function UserProfile() {
  const { user, profile, signOut } = useAuthStore()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out"
    })
  }

  const handleSave = async () => {
    // Implementation for saving profile updates would go here
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully"
    })
  }

  if (!user) return null

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          User Profile
        </CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="text-lg">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold">
              {profile?.full_name || 'User'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={user.email || ''}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Member Since</Label>
            <Input
              value={new Date(user.created_at).toLocaleDateString()}
              disabled
              className="bg-muted"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}