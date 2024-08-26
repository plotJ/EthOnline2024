import React from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { WalletConnection } from "@/components/WalletConnection"

const ResultsTable: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#1c1e21] text-white px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="#" className="text-2xl font-bold">
          VoteChain Nexus
        </Link>
        <WalletConnection />
      </header>
      <nav className="bg-[#2c2f34] text-white px-4 md:px-6 py-3 flex items-center justify-center space-x-6">
        <Link href="#" className="hover:underline">
          Home
        </Link>
        <Link href="#" className="hover:underline">
          Active Ballots
        </Link>
        <Link href="#" className="hover:underline">
          Voting Results
        </Link>
      </nav>
      <main className="flex-1 bg-[#1c1e21] text-white">
        <section className="py-12 md:py-20 px-4 md:px-6 max-w-5xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Welcome to VoteChain Nexus</h1>
            <p className="text-lg md:text-xl text-gray-300">
              A secure and decentralized voting platform built on blockchain technology.
            </p>
            <Button className="rounded-full px-6 py-3 text-sm font-medium">Get Started</Button>
          </div>
        </section>
        <section className="py-12 md:py-20 px-4 md:px-6 bg-[#2c2f34]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Active Ballots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Ballot 1</h3>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5" />
                      <span>Ends in 3 days</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This is a description of Ballot 1. Voters will be able to choose between two options.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button disabled className="rounded-full px-4 py-2 text-sm font-medium">
                    Vote Now
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Ballot 2</h3>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5" />
                      <span>Ends in 7 days</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This is a description of Ballot 2. Voters will be able to choose between multiple options.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="rounded-full px-4 py-2 text-sm font-medium">Vote Now</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Ballot 3</h3>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-5 w-5" />
                      <span>Ends in 14 days</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    This is a description of Ballot 3. Voters will be able to choose between a single option.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button disabled className="rounded-full px-4 py-2 text-sm font-medium">
                    Vote Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-20 px-4 md:px-6 max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Voting Results</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ballot</TableHead>
                <TableHead>Total Votes</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Ballot 1</TableCell>
                <TableCell>2,345</TableCell>
                <TableCell>2023-06-30</TableCell>
                <TableCell>Option A</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ballot 2</TableCell>
                <TableCell>1,789</TableCell>
                <TableCell>2023-07-07</TableCell>
                <TableCell>Option B</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ballot 3</TableCell>
                <TableCell>987</TableCell>
                <TableCell>2023-07-21</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
        </main>
      <footer className="bg-[#2c2f34] text-white px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between">
        <div className="space-x-4">
          <Link href="#" className="hover:underline">
            About
          </Link>
          <Link href="#" className="hover:underline">
            Privacy
          </Link>
          <Link href="#" className="hover:underline">
            Contact
          </Link>
        </div>
        <div className="text-sm text-gray-400">&copy; 2024 VoteChain Nexus. All rights reserved.</div>
      </footer>
    </div>
  )
}

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export default ResultsTable;