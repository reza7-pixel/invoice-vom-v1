import { createFileRoute } from '@tanstack/react-router'
import InvoiceGenerator from '../components/InvoiceGenerator'

export const Route = createFileRoute('/')({
  component: InvoiceGenerator,
})
