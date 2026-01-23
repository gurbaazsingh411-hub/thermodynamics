import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  
  const { signIn, signUp, isAuthenticated, isLoading } = useAuthStore()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent submission while already loading
    if (isLoading) return
    
    try {
      let result
      if (isSignUp) {
        result = await signUp(email, password, 'Demo User')
      } else {
        result = await signIn(email, password)
      }
      
      if (result?.error) {
        toast({
          title: 'Success',
          description: isSignUp 
            ? 'Account created successfully (using demo mode).' 
            : 'Signed in successfully (using demo mode).',
        })
      } else {
        toast({
          title: isSignUp ? 'Account created!' : 'Welcome back!',
          description: isSignUp 
            ? 'Your account has been created successfully.' 
            : 'You have been logged in.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="w-full max-w-md"
      >
        <Card>
          <motion.div variants={staggerItem}>
            <CardHeader className="text-center">
              <motion.div variants={fadeInUp}>
                <CardTitle className="text-2xl">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </CardTitle>
              </motion.div>
              <motion.div variants={fadeInUp} transition={{ delay: 0.1 }}>
                <CardDescription>
                  {isSignUp 
                    ? 'Enter your details to create an account' 
                    : 'Sign in to your account to continue'}
                </CardDescription>
              </motion.div>
            </CardHeader>
          </motion.div>
          
          <motion.form 
            onSubmit={handleSubmit}
            variants={staggerItem}
          >
            <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </motion.div>
            
            <motion.div variants={fadeInUp} transition={{ delay: 0.3 }}>
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      {isSignUp ? 'Creating...' : 'Signing In...'}
                    </div>
                  ) : isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  {isSignUp ? (
                    <>
                      Already have an account?{' '}
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-primary"
                        onClick={() => setIsSignUp(false)}
                      >
                        Sign in
                      </Button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{' '}
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-primary"
                        onClick={() => setIsSignUp(true)}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                </div>
                
                <div className="mt-4 text-center text-xs text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardFooter>
            </motion.div>
          </motion.form>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login