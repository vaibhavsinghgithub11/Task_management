/**
 * API Connection Test Utility
 * Use this to verify all API endpoints are working correctly
 */

import { authApi } from '../api/auth';
import { projectApi } from '../api/projects';
import { taskApi } from '../api/tasks';
import { userApi } from '../api/users';
import { dashboardApi } from '../api/dashboard';

export interface TestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
  responseTime?: number;
}

export class ApiTester {
  private results: TestResult[] = [];
  private token: string | null = null;

  /**
   * Run all API tests
   */
  async runAllTests(): Promise<TestResult[]> {
    this.results = [];
    console.log('🧪 Starting API Connection Tests...\n');

    // Test authentication endpoints
    await this.testAuthEndpoints();

    // Test project endpoints (requires auth)
    if (this.token) {
      await this.testProjectEndpoints();
      await this.testTaskEndpoints();
      await this.testUserEndpoints();
      await this.testDashboardEndpoints();
    }

    this.printResults();
    return this.results;
  }

  /**
   * Test authentication endpoints
   */
  private async testAuthEndpoints() {
    console.log('📝 Testing Authentication Endpoints...');

    // Test login with test credentials
    await this.testEndpoint(
      'POST /api/auth/login',
      async () => {
        const response = await authApi.login({
          email: 'test@example.com',
          password: 'test123',
        });
        this.token = response.data.token;
        return response;
      },
      'Login endpoint'
    );

    // Test get current user
    if (this.token) {
      localStorage.setItem('token', this.token);
      await this.testEndpoint(
        'GET /api/auth/me',
        async () => await authApi.getCurrentUser(),
        'Get current user'
      );
    }
  }

  /**
   * Test project endpoints
   */
  private async testProjectEndpoints() {
    console.log('\n📁 Testing Project Endpoints...');

    // Get all projects
    await this.testEndpoint(
      'GET /api/projects',
      async () => await projectApi.getAll(),
      'Get all projects'
    );

    // Create project
    let projectId: string | null = null;
    await this.testEndpoint(
      'POST /api/projects',
      async () => {
        const response = await projectApi.create({
          title: 'Test Project',
          description: 'This is a test project',
          members: [],
        });
        projectId = response.data._id;
        return response;
      },
      'Create project'
    );

    // Get single project
    if (projectId) {
      await this.testEndpoint(
        'GET /api/projects/:id',
        async () => await projectApi.getById(projectId!),
        'Get single project'
      );

      // Update project
      await this.testEndpoint(
        'PUT /api/projects/:id',
        async () =>
          await projectApi.update(projectId!, {
            title: 'Updated Test Project',
          }),
        'Update project'
      );

      // Delete project
      await this.testEndpoint(
        'DELETE /api/projects/:id',
        async () => await projectApi.delete(projectId!),
        'Delete project'
      );
    }
  }

  /**
   * Test task endpoints
   */
  private async testTaskEndpoints() {
    console.log('\n✅ Testing Task Endpoints...');

    // Get all tasks
    await this.testEndpoint(
      'GET /api/tasks',
      async () => await taskApi.getAll(),
      'Get all tasks'
    );

    // Get my assigned tasks
    await this.testEndpoint(
      'GET /api/tasks/my/assigned',
      async () => await taskApi.getMyAssigned(),
      'Get my assigned tasks'
    );
  }

  /**
   * Test user endpoints
   */
  private async testUserEndpoints() {
    console.log('\n👥 Testing User Endpoints...');

    // Get all users
    await this.testEndpoint(
      'GET /api/users',
      async () => await userApi.getAll(),
      'Get all users'
    );
  }

  /**
   * Test dashboard endpoints
   */
  private async testDashboardEndpoints() {
    console.log('\n📊 Testing Dashboard Endpoints...');

    // Get dashboard stats
    await this.testEndpoint(
      'GET /api/dashboard/stats',
      async () => await dashboardApi.getStats(),
      'Get dashboard statistics'
    );
  }

  /**
   * Test a single endpoint
   */
  private async testEndpoint(
    endpoint: string,
    testFn: () => Promise<any>,
    description: string
  ) {
    const startTime = Date.now();
    try {
      await testFn();
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint,
        method: endpoint.split(' ')[0],
        status: 'success',
        message: `✅ ${description} - ${responseTime}ms`,
        responseTime,
      });
      console.log(`  ✅ ${description} (${responseTime}ms)`);
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error.response?.data?.error || error.message;
      this.results.push({
        endpoint,
        method: endpoint.split(' ')[0],
        status: 'error',
        message: `❌ ${description} - ${errorMessage}`,
        responseTime,
      });
      console.log(`  ❌ ${description} - ${errorMessage}`);
    }
  }

  /**
   * Print test results summary
   */
  private printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Results Summary');
    console.log('='.repeat(50));

    const total = this.results.length;
    const passed = this.results.filter((r) => r.status === 'success').length;
    const failed = this.results.filter((r) => r.status === 'error').length;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter((r) => r.status === 'error')
        .forEach((r) => {
          console.log(`  - ${r.endpoint}: ${r.message}`);
        });
    }

    console.log('='.repeat(50) + '\n');
  }

  /**
   * Get test results
   */
  getResults(): TestResult[] {
    return this.results;
  }
}

/**
 * Quick test function for console
 */
export const testApiConnection = async () => {
  const tester = new ApiTester();
  return await tester.runAllTests();
};

// Make it available in browser console
if (typeof window !== 'undefined') {
  (window as any).testApiConnection = testApiConnection;
}
