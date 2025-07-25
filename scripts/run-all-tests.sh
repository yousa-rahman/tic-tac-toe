#!/bin/bash

# Tic-Tac-Toe Full Stack Project - Test Runner
# This script runs all tests across all components

set -e  # Exit on any error

echo "🧪 Running All Tests for Tic-Tac-Toe Full Stack Project"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists python3; then
    print_error "Python 3 is not installed"
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi

print_success "Prerequisites check passed"

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run tests and track results
run_test_suite() {
    local component=$1
    local test_command=$2
    local directory=$3
    
    print_status "Running tests for $component..."
    
    if [ -d "$directory" ]; then
        cd "$directory"
        
        if eval "$test_command"; then
            print_success "$component tests passed"
            ((TESTS_PASSED++))
        else
            print_error "$component tests failed"
            ((TESTS_FAILED++))
        fi
        
        cd - > /dev/null
    else
        print_warning "$component directory not found, skipping"
    fi
    
    echo ""
}

# Run Python Engine Tests
run_test_suite "Python Engine" \
    "python3 -m pip install -r requirements.txt && python3 -m pytest tests/ -v" \
    "python-engine"

# Run Node.js Backend Tests
run_test_suite "Node.js Backend" \
    "npm install && npm test" \
    "nodejs-backend"

# Run React Web App Tests
run_test_suite "React Web App" \
    "npm install && npm test -- --coverage --watchAll=false" \
    "react-web-app"

# Run React Native App Tests
run_test_suite "React Native App" \
    "npm install && npm test -- --coverage --watchAll=false" \
    "react-native-app"

# Summary
echo "=================================================="
echo "🧪 Test Summary"
echo "=================================================="

if [ $TESTS_FAILED -eq 0 ]; then
    print_success "All test suites passed! ($TESTS_PASSED/$TESTS_PASSED)"
    echo ""
    echo "🎉 Congratulations! All components are working correctly."
    echo "📊 Check individual component directories for detailed coverage reports."
else
    print_error "Some test suites failed ($TESTS_FAILED failed, $TESTS_PASSED passed)"
    echo ""
    echo "🔧 Please check the failed test suites above and fix any issues."
    exit 1
fi

echo ""
echo "📚 For detailed testing information, see TESTING.md"
echo "🚀 To run individual test suites, see the component-specific README files" 