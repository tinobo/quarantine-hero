import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import fb from '../firebase';
import { useParams } from 'react-router-dom';
import { GeoCollectionReference, GeoFirestore, GeoQuery, GeoQuerySnapshot } from 'geofirestore';

export default function OfferHelp () {
  const [answer, setAnswer] = useState('');
  const [mail, setMail] = useState('');
  const [entry, setEntry] = useState({
    id: 1,
    location: 'München',
    request: 'Brauche jemand, der für mich einkauft',
    timestamp: Date.now(),
  });

  let { id } = useParams();

  const getUserData = () => {
// Create a Firestore reference

// Create a GeoFirestore reference
    const geofirestore = new GeoFirestore(fb.store);

// Create a GeoCollection reference
    const geocollection = geofirestore.collection('ask-for-help');

// Add a GeoDocument to a GeoCollection
    geocollection.doc(id).get().then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        setEntry(doc.data());
      }
    });
/*
// Create a GeoQuery based on a location
    const query = geocollection.near({ center: new fb.app.firestore.GeoPoint(40.7589, -73.9851), radius: 1000 });

// Get query (as Promise)
    query.get().then((value) => {
      // All GeoDocument returned by GeoQuery, like the GeoDocument added above
      //setEntry(value.docs[0].data());
    });*/
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

  };

  useEffect(getUserData, []);

  return (<form onSubmit={handleSubmit}>
      <div className="mt-4 p-1">
        <label className="text-base text-gray-700">Anfrage</label>
        {
          <Link to={`/entry/${entry.id}`} className="p-4 border border-gray-400 rounded w-full text-xl block">
            Jemand in <span className="font-bold">{entry.location}</span> bittet um: <span className="italic">{entry.request}</span><br/>
            <span className="text-gray-500 inline-block text-right w-full text-base">{(new Date(entry.timestamp)).toISOString()}</span>
          </Link>
        }
      </div>
      <div className="mt-4 p-1 w-full">
        <label className="text-base text-gray-700">Deine Antwort</label>
        <textarea className="border rounded border-gray-400 p-4 text-xl w-full" onChange={e => setAnswer(e.target.value)}
                  placeholder="Ich kann helfen!"/>
      </div>
      <div className="mt-4 p-1 w-full">
        <label className="text-base text-gray-700">Deine E-Mail</label>
        <input className="border rounded border-gray-400 p-4 text-xl w-full" type="email" onChange={e => setMail(e.target.value)}
               placeholder="ich@helfer.de"/>
      </div>
      <div className="mt-4 m-1 w-full">
        Wenn Sie das abschicken stimmen Sie zu, dass wir ihre Kontaktdaten an den Anfragensteller weiterleiten.
      </div>
      <div className="mt-4 m-1 w-full">
        <button type="submit" className="btn-primary">Senden</button>
      </div>
    </form>
  );
}
