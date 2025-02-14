import { Link, useLoaderData } from '@tanstack/react-router';
import type { FunctionComponent } from '@/common/types';
import Layout from '@/components/layout/Layout';
import { AggregateCard } from '../AggregateCard/AggregateCard';
import { Responder } from '../../models/form-aggregated';

export default function FormAggregatedDetails(): FunctionComponent {
  const formSubmission = useLoaderData({ from: '/responses/$formId/aggregated' });
  const { submissionsAggregate } = formSubmission;
  const { defaultLanguage, formCode, formType, aggregates, formId, responders } = submissionsAggregate;

  const groupedAttachments = responders.reduce<Record<string, Responder>>(
    (grouped, responder) => ({
      ...grouped,
      [responder.responderId]: responder,
    }),
    {}
  );

  return (
    <Layout
      backButton={
        <Link to='/responses' preload='intent'>
          <svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30' fill='none'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M19.0607 7.93934C19.6464 8.52513 19.6464 9.47487 19.0607 10.0607L14.1213 15L19.0607 19.9393C19.6464 20.5251 19.6464 21.4749 19.0607 22.0607C18.4749 22.6464 17.5251 22.6464 16.9393 22.0607L10.9393 16.0607C10.3536 15.4749 10.3536 14.5251 10.9393 13.9393L16.9393 7.93934C17.5251 7.35355 18.4749 7.35355 19.0607 7.93934Z'
              fill='#7833B3'
            />
          </svg>
        </Link>
      }
      breadcrumbs={
        <div className='breadcrumbs flex flex-row gap-2 mb-4'>
          <Link className='crumb' to='/responses' preload='intent'>
            responses
          </Link>
          <Link className='crumb'>{formId}</Link>
        </div>
      }
      title={`${formCode} - ${formType.name}`}>
      <div className='flex flex-col gap-10'>
        {Object.values(aggregates).map((aggregate) => {
          return <AggregateCard key={aggregate.questionId} aggregate={aggregate} language={defaultLanguage} responders={groupedAttachments} />;
        })}
      </div>
    </Layout>
  );
}
